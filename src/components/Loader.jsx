import {useEffect, useState, Children, cloneElement } from 'react';
import DEBUG from 'debug';
const debug = DEBUG('Loader');

export default function Loader({urls, children }) {
    const [data, setData] = useState(urls)
    const [loaded, setLoaded ] = useState(0);
    const count = Object.keys(urls).length;

    useEffect(() => {
        setLoaded(0);

    }, Object.values(urls))

    debug(`${loaded}/${count}`)
    if (loaded >= count) {
        return (Children.map(children, child =>
            cloneElement(child, data)))
    }

    return `Loading... ${loaded}/${count}`
}

export const json = async (url) => await fetch(url)
    .then(async r => await r.json())

export async function loader(urls) {
    return Promise.all(Object.values(urls).map(json))
                  .then(res =>  {
                      const data = {};
                      const keys = Object.keys(urls);
                      for (let k in keys) {
                          data[keys[k]] = res[k]
                      }
                      return data
                  })
    ;
}
