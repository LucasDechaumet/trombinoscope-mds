import { RowDataPacket } from "mysql2/typings/mysql/lib/protocol/packets/RowDataPacket";

export interface Student extends RowDataPacket {
  id: number;
  firstname: string;
  lastname: string;
  birthdate: Date;
  phone: string;
  address: string;
  photo_url: string;
  classe_id: string;
}
