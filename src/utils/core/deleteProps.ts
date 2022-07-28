export function deleteProps<T>(target: { [key: string]: any }, keys: string[]) {
  let result: { [key: string]: any } = {};
  keys.forEach((key) => {
    result[key] = target[key];
    delete target[key];
  });
  return result as T;
}
