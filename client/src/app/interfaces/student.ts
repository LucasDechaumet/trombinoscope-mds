export interface Student {
  id?: string;
  photo_url: string;
  photo_base64?: string; // utilisé pour la prévisualisation
  lastname: string;
  firstname: string;
  birthdate: Date | undefined;
  phone: string;
  address: string;
  classe_id: string | null;
}
