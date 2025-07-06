export interface IBook {
    _id?:string,
    title: string,
    author: string,
    genre: "FICTION" | "NON_FICTION" | "SCIENCE" | "BIOGRAPHY" | "FANTASY",
    isbn: string,
    description?: string,
    copies: number,
    available: boolean
}