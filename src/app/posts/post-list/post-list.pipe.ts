import {PipeTransform, Pipe} from '@angular/core'
import {Post} from '../post.model'


@Pipe({
    name: 'postFilter',
    pure: false
})
export class PostListFilterPipe implements PipeTransform{
    private counter = 0;
    transform(posts: Post[], searchTerm: string): Post[] {
        this.counter ++;
        console.log('Filter pipe count' + this.counter);
        if (!posts || !searchTerm){
            return posts
        }

        return posts.filter( post =>
            post.category.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1)
    }
}