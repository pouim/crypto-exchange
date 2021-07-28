export const INTERVAL = {
    MINUTE: "1",
    MINUTES_5: "5",
    MINUTES_15: "15",
    MINUTES_30: "30",
    HOUR: "60",
    HOURS_3: "180",
    HOURS_6: "360",
    HOURS_12: "720",
    DAY: "D",
    WEEK: "W",
  };

export const TIME_FRAMES = [
    { text: "3y", resolution: INTERVAL.WEEK, description: "3 Years" },
    { text: "1y", resolution: INTERVAL.DAY, description: "1 Year" },
    { text: "3m", resolution: INTERVAL.HOURS_12, description: "3 Months" },
    { text: "1m", resolution: INTERVAL.HOURS_6, description: "1 Month" },
    { text: "7d", resolution: INTERVAL.HOUR, description: "7 Days" },
    { text: "3d", resolution: INTERVAL.MINUTES_30, description: "3 Days" },
    { text: "1d", resolution: INTERVAL.MINUTES_15, description: "1 Day" },
    { text: "6h", resolution: INTERVAL.MINUTES_5, description: "6 Hours" },
    { text: "1h", resolution: INTERVAL.MINUTE, description: "1 Hour" },
  ];