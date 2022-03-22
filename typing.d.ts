export interface Post {
    "_createdAt": string;
    "_id": string;
    "author": {
        name:string;
        image:string;
    };
    comments: Comment[];
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


export interface Comment {
    approved: boolean;
    comment: string;
    email: string;
    name: string;
    post: {
      _ref: string;
      _type: string;
    };
    _createdAt: string;
    _id: string;
    _rev: string;
    _type: string;
    _updatedAt: string;
  }