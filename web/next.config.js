module.exports = {
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
              protocol: 'https',
              hostname: 'outfitoracle-mtfxc.mongodbstitch.com',
              port: '',
              pathname: '/images/**',
          },
          {
            protocol: 'http',
            hostname: '127.0.0.1',
            port: '5000',
            pathname: '/image/**',
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