const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.listen(port, () => {
  console.log(`Server is Running on the ${port}`);
});
app.post("/forensic", async (req, res) => {
  const {
    first_name,
    last_name,
    Criminal,
    Blood_group,
    height,
    weight,
    Evidence,
  } = req.body;
  return await prisma.forensicDetails
    .create({
      data: {
        first_name,
        last_name,
        Criminal,
        Blood_group,
        height,
        weight,
        Evidence,
      },
    })
    .then((data) => {
      return res.status(201).json(data);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
});
app.get("/forensic/page", async (req, res) => {
  const query = req.query;
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 2;
  const last_page = req.query.last_page;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const result = {};
  const totalCount = await prisma.forensicDetails.count();
  const totalPage = Math.ceil(totalCount / limit);
  const currentPage = page || 0;
  try {
    if (page < 0) {
      return res.status(400).json("Page value should not be negative");
    } else if (page === 1 && !last_page) {
      result.totalCount = totalCount;
      result.totalPage = totalPage;
      result.currentPage = currentPage;
      result.next = {
        page: page + 1,
        limit: limit,
      };
      result.paginateData = await prisma.forensicDetails.findMany({
        take: limit,
        skip: startIndex,
        orderBy: {
          id: "desc",
        },
      });
      res.paginatedResult = result;
      result.currentCountPerPage = Object.keys(result.paginateData).length;
      result.range = currentPage * limit;
      return res.status(200).json(result);
    } else if (endIndex < totalCount && !last_page) {
      result.totalCount = totalCount;
      result.totalPage = totalPage;
      result.currentPage = currentPage;
      result.next = {
        page: page + 1,
        limit: limit,
      };
      result.paginateData = await prisma.forensicDetails.findMany({
        take: limit,
        skip: startIndex,
        orderBy: {
          id: "desc",
        },
      });
      res.paginatedResult = result;
      result.currentCountPerPage = Object.keys(result.paginateData).length;
      result.range = currentPage * limit;
      return res.status(200).json(result);
    } else if (startIndex > 0 && !last_page) {
      result.totalCount = totalCount;
      result.totalPage = totalPage;
      result.currentPage = currentPage;
      result.previous = {
        page: page - 1,
        limit: limit,
      };
      result.paginateData = await prisma.forensicDetails.findMany({
        take: limit,
        skip: startIndex,
        orderBy: {
          id: "desc",
        },
      });
      res.paginatedResult = result;
      result.currentCountPerPage = Object.keys(result.paginateData).length;
      result.range = currentPage * limit;
      return res.status(200).json(result);
    } else if (last_page === "true" && page === totalPage) {
      result.totalCount = totalCount;
      result.totalPage = totalPage;
      result.currentPage = totalPage;
      result.last = {
        page: totalPage,
        limit: limit,
      };
      result.paginateData = await prisma.forensicDetails.findMany({
        take: limit,
        skip: startIndex,
        orderBy: {
          id: "desc",
        },
      });
      res.paginatedResult = result;
      result.currentCountPerPage = Object.keys(result.paginateData).length;
      result.range = totalCount;
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ error: "Resource not found" });
    }
  } catch (err) {
    console.error("error", err);
    return res.status(500).json(err);
  }
});
