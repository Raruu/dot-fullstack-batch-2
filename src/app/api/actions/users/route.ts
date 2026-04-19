import { createUserAction } from "@/controllers/actions/users/create";
import { deleteUserAction } from "@/controllers/actions/users/delete";
import { updateUserAction } from "@/controllers/actions/users/update";
import { handleActionRequest } from "../../../../controllers/api-actions";

const DEFAULT_REVALIDATE_TARGET = "/app/user";

export async function POST(request: Request) {
  return handleActionRequest(
    request,
    createUserAction,
    DEFAULT_REVALIDATE_TARGET,
    "Failed to create user.",
  );
}

export async function PUT(request: Request) {
  return handleActionRequest(
    request,
    updateUserAction,
    DEFAULT_REVALIDATE_TARGET,
    "Failed to update user.",
  );
}

export async function DELETE(request: Request) {
  return handleActionRequest(
    request,
    deleteUserAction,
    DEFAULT_REVALIDATE_TARGET,
    "Failed to delete user.",
  );
}
