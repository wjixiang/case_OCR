// jest.config.ts  
import type { Config } from '@jest/types';  

const config: Config.InitialOptions = {  
  // 指定测试文件  
  testMatch: [  
    '**/__tests__/**/*.+(ts|tsx)',   
    '**/?(*.)+(spec|test).+(ts|tsx)'  
  ],  
  
  // 使用 ts-jest 处理 TypeScript  
  transform: {  
    '^.+\\.(ts|tsx)$': 'ts-jest'  
  },  
  
  // 测试环境  
  testEnvironment: 'node',  
  
  // 覆盖率报告  
  collectCoverage: true,  
  coverageReporters: ['text', 'lcov'],  
  
  // 忽略的文件  
  coveragePathIgnorePatterns: [  
    '/node_modules/',   
    '/dist/'  
  ]  
};  

export default config;