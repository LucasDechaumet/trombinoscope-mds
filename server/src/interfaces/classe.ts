import { RowDataPacket } from "mysql2/typings/mysql/lib/protocol/packets/RowDataPacket";

export interface Classe extends RowDataPacket {
  name: string;
  branch: string;
  icon: string;
}
