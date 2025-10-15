export const getDateLabel = (
    date: Date,
    t: (key: string) => string
): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();
    const isWithinWeek =
        date > new Date(today.setDate(today.getDate() - 7)) &&
        !isToday &&
        !isYesterday;
    const isWithinYear = date.getFullYear() === new Date().getFullYear();

    const days = {
        0: t("date.days.sunday"),
        1: t("date.days.monday"),
        2: t("date.days.tuesday"),
        3: t("date.days.wednesday"),
        4: t("date.days.thursday"),
        5: t("date.days.friday"),
        6: t("date.days.saturday"),
    };

    const months = {
        0: t("date.months.january"),
        1: t("date.months.february"),
        2: t("date.months.march"),
        3: t("date.months.april"),
        4: t("date.months.may"),
        5: t("date.months.june"),
        6: t("date.months.july"),
        7: t("date.months.august"),
        8: t("date.months.september"),
        9: t("date.months.october"),
        10: t("date.months.november"),
        11: t("date.months.december"),
    };

    if (isToday) {
        return t("date.today");
    } else if (isYesterday) {
        return t("date.yesterday");
    } else if (isWithinWeek) {
        return days[date.getDay()];
    } else if (isWithinYear) {
        return `${date.getDate()} ${months[date.getMonth()]}`;
    } else {
        return `${date.getDate()} ${
            months[date.getMonth()]
        } ${date.getFullYear()}`;
    }
};
