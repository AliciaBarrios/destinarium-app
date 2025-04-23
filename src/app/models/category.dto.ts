export class CategoryDTO {
    categoryId!: string;
    title: string;
    description: string;
    userId!: string;
  
    constructor(title: string, description: string) {
      this.title = title;
      this.description = description;
    }
}
  