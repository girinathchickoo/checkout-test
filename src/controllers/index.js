import config from "../config";

const controllers = {
  async init(data) {
    return await fetch(`${config.BE}/checkout/init`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "X-Integrator-ID": "01J7GAVEKWEB8DV087H4N4ZKRH",
      },
      body: JSON.stringify(data),
    });
  },
  async submit(data) {
    return await fetch(`${config.BE}/checkout/submit`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "X-Integrator-ID": "01J7GAVEKWEB8DV087H4N4ZKRH",
      },
      body: JSON.stringify(data),
    });
  },
  async getStatus() {
    return await fetch(`${config.BE}/checkout/status?checkoutId=string`);
  },
};

export default controllers;
