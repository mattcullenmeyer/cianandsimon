# Frontend README

The frontend design system is built using Ark UI for headless components and Panda CSS for styling. Park UI can be used to quickly create new pre-styled components built on top of Ark UI.

To create a new component, run the following command:

```bash
npx @park-ui/cli add <ComponentName>
```

The `src/theme/` directory contains the design system configuration, including color tokens and component recipes/styles. The `src/components/ui/` directory contains React components that wrap Ark UI primitives with Panda CSS styling.

## Deployment

```bash
pnpm build
aws s3 sync dist/ s3://cianandsimon.xyz --profile default
aws cloudfront create-invalidation --distribution-id EOIC8GYMH9AO6 --paths '/*' --profile default
```

## DuoLingo Screenshots

- [Friends Quest](https://dribbble.com/shots/19402380-Friends-Quest)
- [New Duolingo Achievements](https://dribbble.com/shots/8560257-New-Duolingo-Achievements)
- [User Profile](https://dribbble.com/shots/10830724-User-Profile)
