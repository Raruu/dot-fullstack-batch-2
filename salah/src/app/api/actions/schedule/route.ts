import { createScheduleAction } from "@/controllers/actions/schedule/create";
import { deleteScheduleAction } from "@/controllers/actions/schedule/delete";
import { updateScheduleAction } from "@/controllers/actions/schedule/update";
import { handleActionRequest } from "../../../../controllers/api-actions";

const DEFAULT_REVALIDATE_TARGET = "/app/rooms";

export async function POST(request: Request) {
  return handleActionRequest(
    request,
    createScheduleAction,
    DEFAULT_REVALIDATE_TARGET,
    "Failed to create schedule.",
  );
}

export async function PUT(request: Request) {
  return handleActionRequest(
    request,
    updateScheduleAction,
    DEFAULT_REVALIDATE_TARGET,
    "Failed to update schedule.",
  );
}

export async function DELETE(request: Request) {
  return handleActionRequest(
    request,
    deleteScheduleAction,
    DEFAULT_REVALIDATE_TARGET,
    "Failed to delete schedule.",
  );
}
