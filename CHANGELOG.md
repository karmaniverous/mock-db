### Changelog

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

#### [0.4.1](https://github.com/karmaniverous/mock-db/compare/0.4.0...0.4.1)

- chore: update deps, remove STAN, fix rollup/TS6 compat [`#2`](https://github.com/karmaniverous/mock-db/pull/2)
- cleanup [`e6e9b2d`](https://github.com/karmaniverous/mock-db/commit/e6e9b2d68cb75f0478d966ecac9e11155070de35)
- docs: add STAN guide to TypeDoc docs [`e18b158`](https://github.com/karmaniverous/mock-db/commit/e18b15814e00d0b913323b4b7efa070050f282d9)
- updated docs [`f525df9`](https://github.com/karmaniverous/mock-db/commit/f525df9da872f5f1e798d19e2bf67955f1decea4)
- ni [`a643d72`](https://github.com/karmaniverous/mock-db/commit/a643d72a0014594baa3418d04e881d7812faed1d)
- chore: add copilot review instructions [`9385a55`](https://github.com/karmaniverous/mock-db/commit/9385a555a237f8d39471e31dd010c23ecbd9edb2)

#### [0.4.0](https://github.com/karmaniverous/mock-db/compare/0.3.5...0.4.0)

> 17 November 2025

- updated dependencies [`0c25367`](https://github.com/karmaniverous/mock-db/commit/0c2536703f25b307a2a2c84af543e11cb85189b3)
- refactor: align with entity-tools TranscodeRegistry rename [`db36d17`](https://github.com/karmaniverous/mock-db/commit/db36d17fba934b05c9f3dc98a95bb5326ca7b5ce)
- chore: release v0.4.0 [`7c16242`](https://github.com/karmaniverous/mock-db/commit/7c16242b35b5fb6680b25791689016236e49b304)
- stan lint warnings [`9a901e4`](https://github.com/karmaniverous/mock-db/commit/9a901e4341999e7257bef3ec2b2bbc01cd80c380)

#### [0.3.5](https://github.com/karmaniverous/mock-db/compare/0.3.4...0.3.5)

> 25 October 2025

- Updated stan imports & docs [`710aa9b`](https://github.com/karmaniverous/mock-db/commit/710aa9bff6acb23b6415ec8a31f86f733531bae4)
- chore: fix ESLint config self-lint (vitest rules access) [`00778c4`](https://github.com/karmaniverous/mock-db/commit/00778c4afd7b5a25ef376438384c273c97dab247)
- test: migrate from Mocha/NYC to Vitest [`ecea8b0`](https://github.com/karmaniverous/mock-db/commit/ecea8b033770f0eaefcba0506ccc2a86810f0c64)
- chore: run Prettier via ESLint; fix knip for prettier [`f6817a9`](https://github.com/karmaniverous/mock-db/commit/f6817a9e63eab22710c68097d276ad18cee707b9)
- docs: expand README and re-export common types [`0e28600`](https://github.com/karmaniverous/mock-db/commit/0e2860047f62afcafcfdca947727712fd62be583)
- chore: prune unused deps and add vitest ESLint rules [`1b69bd2`](https://github.com/karmaniverous/mock-db/commit/1b69bd245dd65c0668bfca8d0de55b1e5d4526df)
- build: adopt model rollup config; fix TS program scope [`7876dfa`](https://github.com/karmaniverous/mock-db/commit/7876dfaa31413cbeaf1cd3df55b976fc15d83198)
- chore: fix @vitest/eslint-plugin typing and move to devDeps [`0fdfdea`](https://github.com/karmaniverous/mock-db/commit/0fdfdea78912cef009a6862e74329d26bd28bffc)
- updated docs [`3372355`](https://github.com/karmaniverous/mock-db/commit/3372355f8674fd65ae3dcd1c4d336bf2f10a5f0c)
- added google drive sync [`f53f734`](https://github.com/karmaniverous/mock-db/commit/f53f7347eec707d9082703bc139953ce5222a0f1)
- build: fix rollup/typedoc after Vitest migration [`64b6e28`](https://github.com/karmaniverous/mock-db/commit/64b6e2846cb6bc4c0b804495dda07a47c47bd578)
- chore: fix ESLint Vitest plugin typing without any/unsafe casts [`64a4fe2`](https://github.com/karmaniverous/mock-db/commit/64a4fe229584798d4bfc58eb036dfc62130a92de)
- build(test): fix TS types and Vitest import stability [`fbf590c`](https://github.com/karmaniverous/mock-db/commit/fbf590c63ed63666bb48f366c6c0874c837ca217)
- chore: release v0.3.5 [`081045c`](https://github.com/karmaniverous/mock-db/commit/081045c2062cb9dcd4e1235c966dc646d25ebdaa)
- chore: migrate ESLint config to TypeScript; lint all TS [`26d43de`](https://github.com/karmaniverous/mock-db/commit/26d43de22ccd536aaf485d40eb4f930e51663f8e)
- build: drop fs-extra; use fs/promises in rollup config [`460faba`](https://github.com/karmaniverous/mock-db/commit/460faba06ba57924f7d347da36dd306ba401f2f5)
- updated docs [`f5e5d74`](https://github.com/karmaniverous/mock-db/commit/f5e5d74e31ffd905af7949da45fdee9b13cf46c8)
- chore: harden ESLint TS config; ignore JS/cache artifacts [`55f9432`](https://github.com/karmaniverous/mock-db/commit/55f9432fb1222ac4d70236f141b4da1653816870)
- build: enforce repo-wide TS type-check; fix vitest config [`03b63bd`](https://github.com/karmaniverous/mock-db/commit/03b63bd98419666efbc075f5b71160d8d338570d)
- test(knip): fix MockDb import in README test; clean knip ignores [`eb85f4c`](https://github.com/karmaniverous/mock-db/commit/eb85f4c606764b0db54fbaf494245a1059e69336)
- chore: relax vitest lint to allow Chai chainers [`3af3fc9`](https://github.com/karmaniverous/mock-db/commit/3af3fc9ec0e887f838d5f0a668dfe3ecdbfe47bd)
- chore: configure knip to ignore docs and selected deps [`949e180`](https://github.com/karmaniverous/mock-db/commit/949e180a46bd3e7ae1aefc1c7aefc1ce87515367)
- build: fix rollup config fs import for typecheck [`e899861`](https://github.com/karmaniverous/mock-db/commit/e899861a89f0c5a3044be40b6e1cb1422a89860d)

#### [0.3.4](https://github.com/karmaniverous/mock-db/compare/0.3.3...0.3.4)

> 9 November 2024

- updated dependencies & docs [`182e864`](https://github.com/karmaniverous/mock-db/commit/182e86466ab3dc35fcdb6e399df577bb45e8abbb)
- chore: release v0.3.4 [`578abae`](https://github.com/karmaniverous/mock-db/commit/578abae84d24a3b9070bb8df38639fd1b83c9da7)

#### [0.3.3](https://github.com/karmaniverous/mock-db/compare/0.3.2...0.3.3)

> 9 October 2024

- chore: release v0.3.3 [`8d016c7`](https://github.com/karmaniverous/mock-db/commit/8d016c7e0c827cd61c3e29e138272b51910f9cef)
- updated dependencies [`eea708c`](https://github.com/karmaniverous/mock-db/commit/eea708ce1abc63be17e371c36a147f93eab0cb8f)

#### [0.3.2](https://github.com/karmaniverous/mock-db/compare/0.3.1...0.3.2)

> 8 October 2024

- updated dependencies & docs [`a510183`](https://github.com/karmaniverous/mock-db/commit/a510183823f0c860badb2c4b202b9d65d89ec0fe)
- updated docs [`0fd8f28`](https://github.com/karmaniverous/mock-db/commit/0fd8f28c769ed38b701857faa3c3bc42b825b391)
- chore: release v0.3.2 [`c767eb3`](https://github.com/karmaniverous/mock-db/commit/c767eb3622d70b9d670cfd1bba1b376f39968948)
- updated docs [`312a779`](https://github.com/karmaniverous/mock-db/commit/312a779ba154e29a7873a4be924ef0d4842496ba)
- updated docs [`c610f35`](https://github.com/karmaniverous/mock-db/commit/c610f35b22e894af3462b54c359af2294fb8af7f)

#### [0.3.1](https://github.com/karmaniverous/mock-db/compare/0.3.0...0.3.1)

> 17 September 2024

- chore: release v0.3.1 [`dd5990c`](https://github.com/karmaniverous/mock-db/commit/dd5990c2109f50d5da5fd31b2ab093e77c2dff93)
- updated dependencies [`a4e9c5b`](https://github.com/karmaniverous/mock-db/commit/a4e9c5bd51a2e0f0e7011ecf58cadfc0bab8b6dd)
- updated release script [`ff00437`](https://github.com/karmaniverous/mock-db/commit/ff004377133b163179321ff0d7fe390fd2695b69)

#### [0.3.0](https://github.com/karmaniverous/mock-db/compare/0.2.1...0.3.0)

> 16 September 2024

- refactored for entity-tools updates [`6d89285`](https://github.com/karmaniverous/mock-db/commit/6d89285c6664147743dcddbf28282b458557006a)
- chore: release v0.3.0 [`f54aff0`](https://github.com/karmaniverous/mock-db/commit/f54aff0d57b44678243cc7ca29543b16b06aaa63)

#### [0.2.1](https://github.com/karmaniverous/mock-db/compare/0.2.0...0.2.1)

> 15 September 2024

- chore: release v0.2.1 [`13fb351`](https://github.com/karmaniverous/mock-db/commit/13fb35168fd7e89c81ebe9ea93c0faefc12cee72)
- partia pagekeys [`6353767`](https://github.com/karmaniverous/mock-db/commit/63537678fd6a7052e3062650ec9b99cb8679809f)

#### [0.2.0](https://github.com/karmaniverous/mock-db/compare/0.1.4...0.2.0)

> 14 September 2024

- refactored for changes in entity tools [`b7107b5`](https://github.com/karmaniverous/mock-db/commit/b7107b5302c03f6ffdf955c6cb7d6914ca8d65a4)
- chore: release v0.2.0 [`2b78ae6`](https://github.com/karmaniverous/mock-db/commit/2b78ae6c6380a8c4e7411c14a869d736ad34e685)

#### [0.1.4](https://github.com/karmaniverous/mock-db/compare/0.1.3...0.1.4)

> 6 September 2024

- refactored to depend on entity-tools [`b5cacce`](https://github.com/karmaniverous/mock-db/commit/b5cacce1f48a9810bb0fd7e56c32aa238b7720d2)
- chore: release v0.1.4 [`e12b7e3`](https://github.com/karmaniverous/mock-db/commit/e12b7e350ffa0408c2bbe6dadcdd74d921da21af)

#### [0.1.3](https://github.com/karmaniverous/mock-db/compare/0.1.2...0.1.3)

> 5 September 2024

- updated docs [`0d785e2`](https://github.com/karmaniverous/mock-db/commit/0d785e234e2077b289cac5ce8df526b4f7fc24aa)
- pageKeys -&gt; pageKey [`623ec44`](https://github.com/karmaniverous/mock-db/commit/623ec44c8c5dc785d76610f95edf874fb60767e6)
- chore: release v0.1.3 [`508bf9c`](https://github.com/karmaniverous/mock-db/commit/508bf9ce88d66e261abda0aeba1e103d3a3e6c9c)

#### [0.1.2](https://github.com/karmaniverous/mock-db/compare/0.1.1...0.1.2)

> 5 September 2024

- troubleshooting dependency type error [`f34036c`](https://github.com/karmaniverous/mock-db/commit/f34036c3ee4a23d2a91cd7daef8c3e6e32165a36)
- updted dependencies [`e3d014a`](https://github.com/karmaniverous/mock-db/commit/e3d014a67ad33f41d70daa90cafa0c1612b502f3)
- updated docs [`33b3dc6`](https://github.com/karmaniverous/mock-db/commit/33b3dc622e6c224fd8658933330cfd3a53ae55f6)
- updated docs [`7d011e1`](https://github.com/karmaniverous/mock-db/commit/7d011e1ef8485e4daeaa9efcdb0b4b3c16faf0b5)
- updated docs [`055f77a`](https://github.com/karmaniverous/mock-db/commit/055f77ae9a73813dc488a1ce343241c117c1b533)
- exclude all external dependencies & clean up type files [`eedfdfb`](https://github.com/karmaniverous/mock-db/commit/eedfdfb55829a79ccfd96f33f5cddeb3a63e0022)
- chore: release v0.1.2 [`3be431c`](https://github.com/karmaniverous/mock-db/commit/3be431c2c814e1f998fcf8b1e3ccd11f2d9908c5)
- try not preserving modules [`f5d3741`](https://github.com/karmaniverous/mock-db/commit/f5d3741f2a48eedcd8de539f3c7663da4b181f2f)
- chore: release v0.1.1-0 [`e8341f7`](https://github.com/karmaniverous/mock-db/commit/e8341f7fa9270c0f138ac1bbc0a9036af13b79e4)
- reinstituted preservemodules [`fbb5882`](https://github.com/karmaniverous/mock-db/commit/fbb58826f44fbfcc9245f491367d152a8618c400)
- excluded external dependency [`d3494e4`](https://github.com/karmaniverous/mock-db/commit/d3494e4078bf3f9e8c4f8b43629fd75ecaa147c1)

#### [0.1.1](https://github.com/karmaniverous/mock-db/compare/0.1.1-0...0.1.1)

> 5 September 2024

#### [0.1.1-0](https://github.com/karmaniverous/mock-db/compare/0.1.0...0.1.1-0)

> 5 September 2024

- troubleshooting dependency type error [`f34036c`](https://github.com/karmaniverous/mock-db/commit/f34036c3ee4a23d2a91cd7daef8c3e6e32165a36)
- updated docs [`308360a`](https://github.com/karmaniverous/mock-db/commit/308360aff1b1113b1b990c4760c9db73d5f5a046)
- updated docs [`7d011e1`](https://github.com/karmaniverous/mock-db/commit/7d011e1ef8485e4daeaa9efcdb0b4b3c16faf0b5)
- updated docs [`fbd6a36`](https://github.com/karmaniverous/mock-db/commit/fbd6a36a6d3f7ed689033ae0870dc00f1af8ab12)
- exclude all external dependencies & clean up type files [`eedfdfb`](https://github.com/karmaniverous/mock-db/commit/eedfdfb55829a79ccfd96f33f5cddeb3a63e0022)
- try not preserving modules [`f5d3741`](https://github.com/karmaniverous/mock-db/commit/f5d3741f2a48eedcd8de539f3c7663da4b181f2f)
- chore: release v0.1.1-0 [`e8341f7`](https://github.com/karmaniverous/mock-db/commit/e8341f7fa9270c0f138ac1bbc0a9036af13b79e4)
- reinstituted preservemodules [`fbb5882`](https://github.com/karmaniverous/mock-db/commit/fbb58826f44fbfcc9245f491367d152a8618c400)
- chore: release v0.1.1 [`e65ae6f`](https://github.com/karmaniverous/mock-db/commit/e65ae6f4627e0ca9fc8b5acd08370e7abcd517c0)
- fixed package entry points [`093fd45`](https://github.com/karmaniverous/mock-db/commit/093fd457856a6fedc942336fc7b03750ed6b7b22)
- excluded external dependency [`d3494e4`](https://github.com/karmaniverous/mock-db/commit/d3494e4078bf3f9e8c4f8b43629fd75ecaa147c1)

#### [0.1.0](https://github.com/karmaniverous/mock-db/compare/0.0.5...0.1.0)

> 2 September 2024

- split query into sync & async versions [`ee2c739`](https://github.com/karmaniverous/mock-db/commit/ee2c73933e79a9faab59de11f81a1c361adcd8f1)
- added async overload to query method [`ac457cf`](https://github.com/karmaniverous/mock-db/commit/ac457cfa07594128f7cd18164c7645b365ac4bac)
- updated readme [`5d1a34a`](https://github.com/karmaniverous/mock-db/commit/5d1a34abaf6da4267b55813e2f5903b091e4c9a7)
- updated docs [`0b5e256`](https://github.com/karmaniverous/mock-db/commit/0b5e256795791e192ef12119fa326a974bf5c740)
- chore: release v0.1.0 [`d986f82`](https://github.com/karmaniverous/mock-db/commit/d986f825ed898d6a388652b99df9843bbb6a72be)

#### [0.0.5](https://github.com/karmaniverous/mock-db/compare/0.0.4...0.0.5)

> 2 September 2024

- updated docs [`eaa5f37`](https://github.com/karmaniverous/mock-db/commit/eaa5f37f5a3867499fde385aba0e7787c1da9542)
- updated docs [`7c1dd74`](https://github.com/karmaniverous/mock-db/commit/7c1dd742333bcc06252e5721b549eef829b89fcb)
- chore: release v0.0.5 [`11382c3`](https://github.com/karmaniverous/mock-db/commit/11382c3dcc0f6ee9ee698604747e6f2a0536da18)
- updated readme [`65edd51`](https://github.com/karmaniverous/mock-db/commit/65edd51d1da3c40d851c636fbf1379457f32e88c)

#### [0.0.4](https://github.com/karmaniverous/mock-db/compare/0.0.3...0.0.4)

> 2 September 2024

- updated docs [`58413d9`](https://github.com/karmaniverous/mock-db/commit/58413d9d3ec0619cd104f31a4aa997fe993a6e03)
- updated docs [`e487b54`](https://github.com/karmaniverous/mock-db/commit/e487b54e479d909d9c1ae804f2d6290fab19a6e8)
- updated docs [`602a7b8`](https://github.com/karmaniverous/mock-db/commit/602a7b86ffdafc05d592ae8b927183851ed211cf)
- chore: release v0.0.4 [`0cf98ce`](https://github.com/karmaniverous/mock-db/commit/0cf98ce26324c425de11cdea9d58cf40a3b73dd7)
- updated docs [`da91268`](https://github.com/karmaniverous/mock-db/commit/da9126878510a2da1002ccd92ba5f9e5bc9f447a)
- updated package [`6b62d6e`](https://github.com/karmaniverous/mock-db/commit/6b62d6e01ebf35a43112fb9488d051829925d635)

#### [0.0.3](https://github.com/karmaniverous/mock-db/compare/0.0.2...0.0.3)

> 2 September 2024

- updated docs [`64fb61c`](https://github.com/karmaniverous/mock-db/commit/64fb61c86c6598b5c39e5eee568c03879826b596)
- chore: release v0.0.3 [`9d1a3ab`](https://github.com/karmaniverous/mock-db/commit/9d1a3ab9d0409efe7b83e373bda95d10a01e8414)
- updated readme [`57ec33d`](https://github.com/karmaniverous/mock-db/commit/57ec33d34d33822e23a98b3f56d5ef8935f03aaf)

#### [0.0.2](https://github.com/karmaniverous/mock-db/compare/0.0.1...0.0.2)

> 2 September 2024

- updated test & docs [`ca57acb`](https://github.com/karmaniverous/mock-db/commit/ca57acbb86f61113b97daee442c7443c43a1afff)
- updated docs [`f01c9db`](https://github.com/karmaniverous/mock-db/commit/f01c9dbb00f6d637248fbacf0e1b76576b9075ef)
- chore: release v0.0.2 [`f4457b5`](https://github.com/karmaniverous/mock-db/commit/f4457b52b4dc079db63e0726ed931599bb09428e)

#### 0.0.1

> 2 September 2024

- Initial commit [`9014cb5`](https://github.com/karmaniverous/mock-db/commit/9014cb511577d92a68d20a6de474caf629d094ff)
- initial commit [`1158e0a`](https://github.com/karmaniverous/mock-db/commit/1158e0a4dd78f0bfa1605b61113e8e49930e8356)
- test -&gt; filter & readme updates [`e3491b6`](https://github.com/karmaniverous/mock-db/commit/e3491b68e76de2ef4c16c33fc3f0b4f8aefb3b52)
- encapsulated Item type [`5f47822`](https://github.com/karmaniverous/mock-db/commit/5f478228e749c64f0abb90009eb3495048d51f0e)
- updated docs [`6bfb6fc`](https://github.com/karmaniverous/mock-db/commit/6bfb6fcf3e50299da6d590a47c39a61458528716)
- updated docs [`1710d5f`](https://github.com/karmaniverous/mock-db/commit/1710d5fff4f894f53a08ed872268f7879dbe79b7)
- added typedoc mdn links [`53fd51d`](https://github.com/karmaniverous/mock-db/commit/53fd51d173f84da70393a3dcc12b83839d5ccfb2)
- updated docs [`52b7022`](https://github.com/karmaniverous/mock-db/commit/52b70220373109c67ef29aac3064d09989ad4a69)
- updated docs [`cd6d622`](https://github.com/karmaniverous/mock-db/commit/cd6d622586843777c5e6bd7dda2feaa16f925de3)
- updated docs [`5bdc205`](https://github.com/karmaniverous/mock-db/commit/5bdc20522f596e9da58aa447bea18166f39134ca)
- updated docs [`9ccb1ae`](https://github.com/karmaniverous/mock-db/commit/9ccb1aec87d0384cc08ccc2c05e36148081f3eca)
- updated docs [`db26d28`](https://github.com/karmaniverous/mock-db/commit/db26d28e4145e360b128bb5a32df9eb56e408e40)
- updated docs [`9009774`](https://github.com/karmaniverous/mock-db/commit/900977467eac8eca1feb97d78caee3878765e39d)
- updated docs [`4257400`](https://github.com/karmaniverous/mock-db/commit/425740088f095a24c86e54efee1f8a28c3a0e316)
- updated package.json [`e3e239d`](https://github.com/karmaniverous/mock-db/commit/e3e239d1b6b5965afaccad263a7a09f38a757063)
- chore: release v0.0.1 [`dea3010`](https://github.com/karmaniverous/mock-db/commit/dea3010479c5a8b3642c3953fcf886bba34b10a1)
