import { PAGINATION_DEFAULT_PAGE_SIZE } from "@/libs/config";
import db from "@/models/db";
import { parsePositiveInt } from "@/libs/utils";
import { UserListData, UserListQueryInput } from "@/types/users/users-list";

export async function getUserListData(
  input: UserListQueryInput = {},
): Promise<UserListData> {
  const page = parsePositiveInt(input.page, 1);
  const pageSize = parsePositiveInt(
    input.pageSize,
    PAGINATION_DEFAULT_PAGE_SIZE,
  );
  const search = (input.search ?? "").trim();
  const status = ["verified", "unverified"].includes(input.status ?? "")
    ? (input.status as "verified" | "unverified")
    : "all";

  const where = {
    ...(search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
    ...(status === "all"
      ? {}
      : {
          emailVerified: status === "verified",
        }),
  };

  const [rows, totalCount] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { name: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
      },
    }),
    db.user.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return {
    rows,
    filters: {
      status,
      search,
    },
    pagination: {
      page: Math.min(page, totalPages),
      pageSize,
      totalPages,
      totalCount,
    },
  };
}
