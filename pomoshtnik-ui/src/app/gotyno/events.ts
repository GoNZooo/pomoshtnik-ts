import * as svt from "simple-validation-tools";

export type ClientEvent = Click;

export enum ClientEventTag {
  Click = "Click",
}

export type Click = {
  type: ClientEventTag.Click;
};

export function Click(): Click {
  return {type: ClientEventTag.Click};
}

export function isClientEvent(value: unknown): value is ClientEvent {
  return [isClick].some((typePredicate) => typePredicate(value));
}

export function isClick(value: unknown): value is Click {
  return svt.isInterface<Click>(value, {type: ClientEventTag.Click});
}

export function validateClientEvent(value: unknown): svt.ValidationResult<ClientEvent> {
  return svt.validateWithTypeTag<ClientEvent>(
    value,
    {[ClientEventTag.Click]: validateClick},
    "type"
  );
}

export function validateClick(value: unknown): svt.ValidationResult<Click> {
  return svt.validate<Click>(value, {type: ClientEventTag.Click});
}
