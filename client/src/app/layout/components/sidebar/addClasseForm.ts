import { Branch } from './branch';

export interface AddClassForm {
  name: string;
  branch: Branch | undefined;
  icon: string;
}
