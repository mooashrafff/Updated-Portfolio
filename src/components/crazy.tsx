'use client';

import React from 'react';
import { Photos, PhotoItem } from './photos';

const Crazy = () => {
  const sportPhotos: PhotoItem[] = [
    {
      src: '/fun.png',
      alt: 'Directed 12+ large-scale campus events, organized international festivals like Gouna Film Festival, and even managed logistics for national sports events — all while completing my BIS degree.',
      caption:'Directed 12+ large-scale campus events, organized international festivals like Gouna Film Festival, and even managed logistics for national sports events — all while completing my BIS degree.',
    },
  ];

  return (
    <div className="mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-foreground text-3xl font-semibold md:text-4xl">
          AAST Welcome Party 2024
        </h2>
      </div>
      <Photos photos={sportPhotos} />
    </div>
  );
};

export default Crazy;