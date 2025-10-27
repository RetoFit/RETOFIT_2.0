# app/grpc/server.py

import grpc
from grpc_reflection.v1alpha import reflection
from concurrent import futures
import logging

from app.grpc import users_pb2, users_pb2_grpc
from app.db.session import SessionLocal
from app.db.models import User  # ajusta el nombre si tu modelo es distinto


class UserServiceServicer(users_pb2_grpc.UserServiceServicer):
    def GetUser(self, request, context):
        db = SessionLocal()
        user = db.query(User).filter(User.id == request.id).first()

        if not user:
            context.set_code(grpc.StatusCode.NOT_FOUND)
            context.set_details(f"User with id {request.id} not found")
            return users_pb2.GetUserResponse()

        return users_pb2.GetUserResponse(
            id=user.id,
            name=user.name,
            email=user.email,
        )


async def serve_grpc() -> None:
    server = grpc.aio.server()
    users_pb2_grpc.add_UserServiceServicer_to_server(UserServiceServicer(), server)

    SERVICE_NAMES = (
        users_pb2.DESCRIPTOR.services_by_name["UserService"].full_name,
        reflection.SERVICE_NAME,
    )
    reflection.enable_server_reflection(SERVICE_NAMES, server)

    server.add_insecure_port("[::]:50051")
    logging.info("✅ gRPC server running on port 50051")
    await server.start()
    await server.wait_for_termination()
