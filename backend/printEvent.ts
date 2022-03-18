const { log } = console;
// Display event
export default (event: Event): void => {
  log(new Date().toString());
  for (const [key, value] of Object.entries(event)) {
    log(`${key}:`, value);
  }
};
