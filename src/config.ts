//mc服务端根目录
const mcRootPath = "C:/bin/bedrock-server-1.16.201.03";

//可执行文件
const executable = "bedrock_server.exe";

//存档名称
const levelName = "Bedrock level";

export const config = {
  mc: {
    cwd: mcRootPath,
    path: `${mcRootPath}/${executable}`,
    worlds: `${mcRootPath}/worlds`,
    levelName: `${levelName}`,
  },
  server: { port: 23333, token: "yourtoken" },
};
