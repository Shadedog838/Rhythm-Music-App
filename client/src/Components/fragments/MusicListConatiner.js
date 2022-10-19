import React from "react";
import { Fragment } from "react";

export default function MusicListConatiner() {
  return (
    <Fragment>
      <table>
        <tbody>
        <tr>
          <th>Company</th>
          <th>Contact</th>
          <th>Country</th>
        </tr>
        <tr>
          <td>Alfreds Futterkiste</td>
          <td>Maria Anders</td>
          <td>Germany</td>
        </tr>
        <tr>
          <td>Centro comercial Moctezuma</td>
          <td>Francisco Chang</td>
          <td>Mexico</td>
        </tr>
        </tbody>
      </table>
    </Fragment>
  );
}
