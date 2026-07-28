export const rankExposure = {

    "1": 72,

    "2": 120,

    "3": 168,

    "4": 240,

};


export function getExposure(rank: string) {

    return rankExposure[
        rank as keyof typeof rankExposure
    ] ?? 0;

}