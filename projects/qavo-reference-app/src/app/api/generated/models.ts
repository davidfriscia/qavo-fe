/* eslint-disable */
/**
 * Qavo Reference API
 *
 * NOTE: This file illustrates the *shape* of code emitted by `openapi-generator`
 * (`typescript-angular`) from the backend's OpenAPI document. In a real project
 * the `api/generated` folder is produced by a CI step and is not edited by hand.
 * See `api/README.md` for the generation command.
 */

export interface UserDto {
  id: string;
  username: string;
  displayName: string;
  email: string;
  roles: string[];
}

export interface PageUserDto {
  content: UserDto[];
  totalElements: number;
  totalPages: number;
  number: number;
}
