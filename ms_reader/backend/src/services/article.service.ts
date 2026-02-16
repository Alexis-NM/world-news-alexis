import prisma from "../lib/prisma.js";

class ArticlesService {
  async getLastTenByMostRecent() {
    return prisma.article.findMany({
      select: {
        id: true,
        title: true,
        subtitle: true,
        subhead: true,
        publish_date: true,
      },
      orderBy: {
        publish_date: "desc",
      },
      take: 10,
    });
  }

  async getById(id: number) {
    return prisma.article.findUnique({
      where: { id },
    });
  }
}

export default ArticlesService;
