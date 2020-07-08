import React from 'react';
import loadable from '@loadable/component';
import Loading from './Loading';

export default function WidthLoadable(component) {
  return loadable(component, { fallback: <Loading /> });
}
