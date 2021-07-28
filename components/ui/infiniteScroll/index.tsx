import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from 'react-query';

import { useIntersectionObserver } from 'lib/hooks/use-intersection-observer';
import LoadSpin from '../Loading/LoadingSpin';
type paginationDetailsType = {
    limit: number;
    offset: number;
};
export interface Props {
    name: string;
    fetchDataFn: Function;
    renderItem: (data: any, index: number) => ReactElement;
}
var currentPage = 0;

const InfinitScroll: React.FC<Props> = ({ name, renderItem, fetchDataFn }) => {
    let id = 0;
    const div = useRef<HTMLDivElement>(null);
    const [{ limit, offset }, setPageDetails] = useState<paginationDetailsType>({
        limit: 0,
        offset: 0,
    });

    const view = useIntersectionObserver({
        ref: div,
        options: { threshold: 1, triggerOnce: false },
    });

    const { fetchNextPage, data, isFetching } = useInfiniteQuery(
        name,
        async (page) => {
            console.log(page);
            return await fetchDataFn({
                limit: '10',
                offset: page.pageParam,
            });
        },
        {
            refetchOnWindowFocus: false,
            // getNextPageParam: (lastPage: any, allPage) => {
            //     console.log({ lastPage });
            //     setPageDetails({
            //         limit: limit,
            //         offset: offset,
            //     });
            // },
        },
    );

    useEffect(() => {
        if (view) {
            console.log(offset);
            if (offset) {
                if (currentPage >= 10) return;
            }
            currentPage = currentPage + 10;
            console.log(currentPage);
            fetchNextPage({ pageParam: currentPage });
        }
    }, [view]);
    return (
        <>
            <>
                <>
                    {/* {data?.pages[0].results.map((data, index) => {
                        return renderItem(data, index);
                    })} */}
                    {console.log({ data })}
                    {data?.pages?.map((page) => {
                        return page?.results?.map((data: any, index: number) => {
                            id++;
                            return renderItem(data, index);
                        });
                    })}
                </>
            </>
            <div ref={div} className="w-full h-4 bg-transparent" />
            {isFetching ? (
                <div className="w-full flex justify-center items-center">
                    <LoadSpin color="gray" w={16} />
                </div>
            ) : null}
        </>
    );
};

export default InfinitScroll;
