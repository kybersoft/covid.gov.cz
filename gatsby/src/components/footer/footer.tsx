import React from 'react';
import classnames from 'classnames';

import { useCurrentLanguage } from '@/components/i18n';

import styles from './footer.module.scss';
import { graphql, useStaticQuery } from 'gatsby';
import { IFooterLinksQuery } from '@graphql-types';

const DRUPAL_INTERNAL_IDS = {
  USEFUL_LINKS_1: '1',
  USEFUL_LINKS_2: '2',
  USEFUL_LINKS_3: '4',
  COPYRIGHT: '3',
};

export const query = graphql`
  query FooterLinks {
    allBlocks {
      edges {
        node {
          drupal_internal__id
          langcode
          content {
            processed
          }
        }
      }
    }
    currentBuildDate {
      currentDate
    }
  }
`;

const Footer: React.FC = () => {
  const result = useStaticQuery<IFooterLinksQuery>(query);
  const currentLanguage = useCurrentLanguage();

  const getContentByDrupalInternalId = (internalId: string) => {
    const edge = result.allBlocks.edges.find(({ node }) => {
      const matchesLanguage = node.langcode === currentLanguage;
      const matchesId = node.drupal_internal__id === internalId;
      return matchesLanguage && matchesId;
    });

    return edge.node.content.processed;
  };

  return (
    <div
      className={classnames(styles.footer, 'footer mt-4')}
      role="contentinfo"
    >
      <div className="container">
        <div className="footer__inner pt-md-2">
          <div className="footer__links pb-3">
            <div className="row">
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="footer__box pb-4 pb-lg-0">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: getContentByDrupalInternalId(
                        DRUPAL_INTERNAL_IDS.USEFUL_LINKS_2,
                      ),
                    }}
                  />
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-5">
                <div className="footer__box pb-4 pb-lg-0">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: getContentByDrupalInternalId(
                        DRUPAL_INTERNAL_IDS.USEFUL_LINKS_3,
                      ),
                    }}
                  />
                </div>
              </div>

              <div className="col-12 col-lg-4">
                <div className="footer__box">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: getContentByDrupalInternalId(
                        DRUPAL_INTERNAL_IDS.USEFUL_LINKS_1,
                      ),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="footer__common">
            <div className="row">
              <div className="col-12">
                <div className="footer__box">
                  <div
                    className=""
                    dangerouslySetInnerHTML={{
                      __html: getContentByDrupalInternalId(
                        DRUPAL_INTERNAL_IDS.COPYRIGHT,
                      ),
                    }}
                  />
                </div>
              </div>
              {process.env.GATSBY_VERCEL && (
                <div className="col-12">
                  <div className="footer__box">
                    <div className="footer__brand">
                      {'Poslední úspěšný build proběhl v ' +
                        new Date(
                          result.currentBuildDate.currentDate,
                        ).toLocaleString('cs-CZ', {
                          day: 'numeric',
                          month: 'numeric',
                          weekday: 'long',
                          hour: '2-digit',
                          minute: '2-digit',
                          timeZone: 'Europe/Prague',
                        })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
