import { CategoryDTO } from "./category.dto";

export interface FullCard {
    imageUrl: string;
    link: string;
    title: string;
    date: Date;
    author: string;
    categories: string[];
    rating: number;
}