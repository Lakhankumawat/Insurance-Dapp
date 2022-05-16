import React from 'react';
function Waves() {
    return <div>
        <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
            <defs>
                <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            </defs>
            <g className="parallax">
                <use xlinkHref="#gentle-wave" x="48" y="0" fill="#B8FFF9" />
                <use xlinkHref="#gentle-wave" x="48" y="3" fill="#B8FFF9" />
                <use xlinkHref="#gentle-wave" x="48" y="5" fill="#DAE9ED" />
                <use xlinkHref="#gentle-wave" x="48" y="7" fill="#DAE9ED" />
            </g>
        </svg>
    </div>;
}

export default Waves;
