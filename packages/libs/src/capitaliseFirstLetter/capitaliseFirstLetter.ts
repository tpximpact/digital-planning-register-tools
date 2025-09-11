/*
 * This file is part of the Digital Planning Register project.
 *
 * Digital Planning Register is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Digital Planning Register is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Digital Planning Register. If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Capitalizes the first letter of a given string.
 *
 * @param {string} string - The string to be capitalized.
 * @returns {string} - The string with the first letter capitalized.
 *
 * @example
 * // Returns "Hello"
 * capitalizeFirstLetter("hello");
 *
 * @example
 * // Returns "Hello world"
 * capitalizeFirstLetter("hello world");
 *
 * @example
 * // Returns "123abc"
 * capitalizeFirstLetter("123abc");
 */
export const capitaliseFirstLetter = (string: string) => {
  return (
    string.toLowerCase().charAt(0).toUpperCase() + string.toLowerCase().slice(1)
  )
}
