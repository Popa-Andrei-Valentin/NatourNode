class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // a) Filtering
    const queryObj = {...this.queryString};
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach(field => delete queryObj[field]);
    // b) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      let sortingQuery = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortingQuery);
    } else {
      this.query = this.query.sort("-createdAt"); // Default sorting
    }

    return this;
  }

  fieldLimit() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v"); // in this case it excludes the mentioned field.
    }

    return this;
  }

  pagination() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit)

    return this;
  }
}

export default APIFeatures