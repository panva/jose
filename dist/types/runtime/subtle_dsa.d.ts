export default function subtleDsa(alg: string): {
    hash: {
        name: string;
    };
    name: string;
    saltLength?: undefined;
    namedCurve?: undefined;
} | {
    hash: {
        name: string;
    };
    name: string;
    saltLength: number;
    namedCurve?: undefined;
} | {
    hash: {
        name: string;
    };
    name: string;
    namedCurve: string;
    saltLength?: undefined;
};
