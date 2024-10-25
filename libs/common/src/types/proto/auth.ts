// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               v3.12.4
// source: proto/auth.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "auth";

export interface AuthenticationMessage {
  Authentication: string;
}

export interface CurrentUserMessage {
  userId: string;
  email: string;
  uType: string;
  accountId: string;
  roleId: string;
  partnerId: string;
}

export interface CheckPermissionsRequest {
  currentUser: CurrentUserMessage | undefined;
  subject: string;
  actions: string[];
}

export interface CheckPermissionsResponse {
  hasPermission: boolean;
}

export interface GetUserByIdRequest {
  userId: string;
}

export interface UserMessage {
  userId: string;
  email: string;
  /** user type, like superadmin, partner, admin etc. */
  uType: string;
  roleId: string;
  accountId: string;
  ownerId: string;
  addedBy: string;
  /** Ensure it's defined as an array */
  ancestorIds: string[];
}

export interface GetUserByIdResponse {
  userObj: UserMessage | undefined;
}

export const AUTH_PACKAGE_NAME = "auth";

export interface AuthServiceClient {
  authenticate(request: AuthenticationMessage): Observable<CurrentUserMessage>;

  checkPermissions(request: CheckPermissionsRequest): Observable<CheckPermissionsResponse>;

  getUserById(request: GetUserByIdRequest): Observable<GetUserByIdResponse>;
}

export interface AuthServiceController {
  authenticate(
    request: AuthenticationMessage,
  ): Promise<CurrentUserMessage> | Observable<CurrentUserMessage> | CurrentUserMessage;

  checkPermissions(
    request: CheckPermissionsRequest,
  ): Promise<CheckPermissionsResponse> | Observable<CheckPermissionsResponse> | CheckPermissionsResponse;

  getUserById(
    request: GetUserByIdRequest,
  ): Promise<GetUserByIdResponse> | Observable<GetUserByIdResponse> | GetUserByIdResponse;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["authenticate", "checkPermissions", "getUserById"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = "AuthService";
