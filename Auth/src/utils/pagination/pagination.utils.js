function getPagination(page, pageSize) {
  const limit = pageSize ? +pageSize : 10;
  const offset = page ? page * limit : 0;

  return { limit, offset };
}

function getPagingData(data, page, limit) {
  const { count: totalItem, rows: items } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItem / limit);

  return { totalItem, items, totalPages, currentPage };
}

export { getPagination, getPagingData };
