/**
 * @jest-environment jsdom
 */

import { render } from "@testing-library/svelte";
import Button from "./Button.svelte";

test("renders a button with provided label", () => {
  render(Button, { label: "click me", onClick: () => console.log("clicked") });
});
