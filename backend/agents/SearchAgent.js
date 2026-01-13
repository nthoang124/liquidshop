const Fuse = require("fuse.js");
const Product = require("../models/productModel");

class SearchAgent {
    constructor() {
        this.searchEngine = null;
        this.cachedProducts = [];
        this.lastUpdated = 0;
    }

    async init() {
        await this.updateSearchIndex();
    }

    async updateSearchIndex() {
        const now = Date.now();
        if (now - this.lastUpdated > 300000 || !this.searchEngine) {
            try {
                const products = await Product.find({ status: "active" })
                    .populate("brand", "name")
                    .populate("category", "name")
                    .select("name price description brand category specifications tags");

                // Chuẩn hóa dữ liệu
                this.cachedProducts = products.map((p) => ({
                    price: p.price,
                    searchText: `ID:${p.id} ${p.name}
            ${p.brand?.name || ""},
            ${p.category?.name || ""}
            ${p.description || ""}
            ${JSON.stringify(p.specifications || "")}
            ${p.tags}`,
                    raw: {
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        description: p.description,
                        brand: p.brand?.name || "",
                        category: p.category?.name || "",
                        specifications: p.specifications,
                        tags: p.tags,
                    },
                }));

                const options = {
                    isCaseSensitive: false,
                    includeScore: true,
                    shouldSort: true,
                    keys: ["searchText"],
                    threshold: 0.4,
                    distance: 1000,
                    ignoreLocation: true,
                };

                this.searchEngine = new Fuse(this.cachedProducts, options);
                this.lastUpdated = now;
                console.log(`[SearchAgent] Updated index with ${this.cachedProducts.length} products.`);
            } catch (e) {
                console.error("[SearchAgent] Update Error:", e);
            }
        }
    }

    search(queryObj) {
        if (!this.searchEngine) return [];

        let results = [];
        const keyword = queryObj.keyword || queryObj.category || "";

        if (keyword) {
            const fuseResults = this.searchEngine.search(keyword);
            results = fuseResults.map((r) => r.item);
        } else {
            results = this.cachedProducts;
        }

        // Filter by Price
        if (queryObj.price_max) results = results.filter((p) => p.price < queryObj.price_max);
        if (queryObj.price_min) results = results.filter((p) => p.price > queryObj.price_min);

        // Filter by Category
        if (queryObj.category) {
            const categoryKeyword = queryObj.category.toLowerCase();
            results = results.filter((p) => p.raw.category.toLowerCase().includes(categoryKeyword));
        }

        // Sort
        if (queryObj.sort_by) {
            if (queryObj.sort_by === "price_desc") {
                results.sort((a, b) => b.price - a.price);
            } else if (queryObj.sort_by === "price_asc") {
                results.sort((a, b) => a.price - b.price);
            }
        }

        return results;
    }

    getTopProducts(queryObj, limit = 10) {
        const results = this.search(queryObj);
        return results.slice(0, limit);
    }
}

module.exports = new SearchAgent();
