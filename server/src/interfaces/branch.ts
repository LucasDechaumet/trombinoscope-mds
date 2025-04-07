import { RowDataPacket } from "mysql2/typings/mysql/lib/protocol/packets/RowDataPacket";

export interface Branch extends RowDataPacket {
  name: string;
  icon: string;
}
