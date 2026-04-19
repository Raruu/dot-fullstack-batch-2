import { createRoomAction } from "@/controllers/actions/rooms/create";
import { deleteRoomAction } from "@/controllers/actions/rooms/delete";
import { updateRoomAction } from "@/controllers/actions/rooms/update";
import { handleActionRequest } from "../../../../controllers/api-actions";

const DEFAULT_REVALIDATE_TARGET = "/app/rooms";

export async function POST(request: Request) {
  return handleActionRequest(
    request,
    createRoomAction,
    DEFAULT_REVALIDATE_TARGET,
    "Failed to create room.",
  );
}

export async function PUT(request: Request) {
  return handleActionRequest(
    request,
    updateRoomAction,
    DEFAULT_REVALIDATE_TARGET,
    "Failed to update room.",
  );
}

export async function DELETE(request: Request) {
  return handleActionRequest(
    request,
    deleteRoomAction,
    DEFAULT_REVALIDATE_TARGET,
    "Failed to delete room.",
  );
}
