module.exports = ({ env }) => ({
  upload: {
    provider: "multiple-provider",
    providerOptions: {
      selectProvider(file) {
        // if(file.name.match(/\.pdf$/))
        //   return 'documents'
        // else
        if (file.name.match(/\.(jpe?g|png|webp|svg)$/)) return "images";
        else return "default";
      },
      providers: {
        images: {
          provider: "local",
        },
        default: {
          provider: "local-path",
          options: {
            path: process.env.FRONTEND_UPLOAD_FOLDER,
          },
        },
      },
    },
  },
});
