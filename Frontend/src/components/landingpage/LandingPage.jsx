import React from 'react';
import Hero from './Hero';
import ProblemStatement from './ProblemStatement';
import HowItWorks from './HowItWorks';
import Features from './Features';
import TargetAudience from './TargetAudience';
import SampleSessions from './SampleSessions';
import Testimonials from './Testimonials';
import FinalCTA from './FinalCTA';

const LandingPage = () => {
    return (
        <main>
            <Hero />
            <ProblemStatement />
            <HowItWorks />
            <Features />
            <TargetAudience />
            <SampleSessions />
            {/* <Testimonials /> */}
            {/* <FinalCTA /> */}
        </main>
    );
};

export default LandingPage;
