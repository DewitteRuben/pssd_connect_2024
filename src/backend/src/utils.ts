const getEnvironmentVariables = (names: string | string[]) => {
  if (typeof names === "string") {
    if (!process.env[names]) {
      throw new Error(`${names} is not set`);
    }

    return { [names]: process.env[names] };
  }

  const variables: Record<string, string> = {};
  for (const name of names) {
    if (!process.env[name]) {
      throw new Error(`${name} is not set`);
    }

    variables[name] = process.env[name];
  }

  return variables;
};
