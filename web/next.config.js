module.exports={
  //formats: ["image/avif", "image/webp", "image/jpg"],
  images: {
    //formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'assets.myntassets.com',
        port: '',
        pathname: '/v1/**',
      },
      {
        protocol: 'http',
        hostname: 'assets.myntassets.com',
        port: '',
        pathname: '/assets/images/**',
      },
      {
        protocol: 'https',
        hostname: 'outfitoracle-mtfxc.mongodbstitch.com',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'http',
        hostname: '10.0.0.3',
        port: '5000',
        pathname: '/image/**',
      },
      {
        protocol: 'https',
        hostname: 'dalleproduse.blob.core.windows.net',
        port: '',
        pathname: '/private/images/**',
      }

    ]
  }
}

/*    
    images: {
        loader: 'custom',
        loaderFile: "./public/imageLoader.js"
    }
  }
*/


/*

{
        formats: ["image/avif", "image/webp", "image/jpg"],
        remotePatterns: [
        {
          protocol: 'https',
          hostname: 'assets.myntassets.com',
          port: '',
          pathname: '/v1/images/**',
        },
      ],
    },

*/