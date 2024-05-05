const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("Tsystem", (m) => {

  const TsystemModule = m.contract("TicketingSystem");

  return { TsystemModule };
});
