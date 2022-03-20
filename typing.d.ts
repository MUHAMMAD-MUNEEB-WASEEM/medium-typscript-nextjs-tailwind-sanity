export interface Post {
    "_createdAt": string;
    "_id": string;
    "author": {
        name:string;
        image:string;
    };
    "body": [object];
    "description": string;
    "mainImage": {
        "asset": {
            url:string;
        };
    };
    "slug": {
        "current": string;
    },
    "title": string;
}