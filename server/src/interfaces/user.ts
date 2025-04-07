import { RowDataPacket } from "mysql2/typings/mysql/lib/protocol/packets/RowDataPacket";

export interface User extends RowDataPacket {
  email: string;
  password: string;
}
