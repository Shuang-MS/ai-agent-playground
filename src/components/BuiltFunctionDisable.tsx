import React from 'react';
import { useContexts } from '../providers/AppProvider';
import { componentLoadingStyles } from '../styles/componentLoadingStyles';
import { Profiles } from '../lib/Profiles';

const BuiltFunctionDisable: React.FC = () => {
  const { isNightMode } = useContexts();

  const componentLoading = componentLoadingStyles({ isNightMode });
  const profiles = new Profiles();

  return profiles.currentProfile?.isDefaultScene ? null : (
    <div className="content-block functionsDisabled container_bg">
      <div
        style={{
          ...componentLoading.camLoading,
          fontSize: '12px',
          textAlign: 'center',
          wordBreak: 'break-word',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        Avatar and Camera are disabled
        <br />
        Because scene is not default
      </div>
    </div>
  );
};

export default BuiltFunctionDisable;
