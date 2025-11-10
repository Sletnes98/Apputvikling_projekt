//======================================
export class Product {
  setFromApiData(apiData) {
    this.id = apiData.id;
    this.category_id = apiData.category_id;
    this.name = apiData.name;
    this.heading = apiData.heading;
    this.descr = apiData.description;
    this.price = apiData.price;
    this.discount = apiData.discount;
    this.stock = apiData.stock;
    this.expected_shipped = apiData.expected_shipped;
    this.reserved_members = apiData.reserved_members;
    this.rating = apiData.rating; // gj.snitt fra kommentarer om tilgjengelig
    this.img_large = apiData.img_large; // filnavn til 300x300
    this.img_small = apiData.img_small; // filnavn til 100x100
    this.static = apiData.static; // true for serverens «preloadede» varer
    // extra_1..extra_4 om du trenger dem
  }
}

//======================================
export class Category {
  setFromApiData(apiData) {
    this.id = apiData.id;
    this.catName = apiData.category_name;
    this.catDescr = apiData.description;
  }
}
