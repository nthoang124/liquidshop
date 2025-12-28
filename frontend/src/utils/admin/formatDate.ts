const mergeDateTime = (date?:  Date, time?: string) => {
    if(!date || !time) return null

    const [h, m, s] = time.split(':').map(Number)

    const d = new Date(date)

    d.setHours(h, m, s || 0);
    return d.toISOString();
}

const toUTCStartOfDayVN = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0); 
  return d.toISOString(); 
};

export {mergeDateTime, toUTCStartOfDayVN}